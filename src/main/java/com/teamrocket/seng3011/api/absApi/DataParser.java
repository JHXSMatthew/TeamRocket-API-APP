package com.teamrocket.seng3011.api.absApi;

import com.teamrocket.seng3011.api.State;
import com.teamrocket.seng3011.api.absApi.entries.*;
import com.teamrocket.seng3011.api.exceptions.CannotParseJSONException;
import com.teamrocket.seng3011.api.exceptions.CannotParseStatsTypeException;
import com.teamrocket.seng3011.utils.DateUtils;
import org.springframework.boot.json.JsonJsonParser;
import org.springframework.boot.json.JsonParser;

import java.text.ParseException;
import java.util.*;

/**
 * Created by JHXSMatthew on 20/03/2017.
 */
public class DataParser {
    private JsonParser parser ;
    private Map<String, Object> root;
    private Map<String, Object> data;
    private List<Object> struc;

    private final static int POSITION_DATE =5;
    private final static int POSITION_RETAIL_Industry = 2;
    private final static int POSITION_STATE = 0;
    private final static int POSITION_EXPORT_COMMODITY = 1;


    public DataParser(String json){
        parser = new JsonJsonParser();
        root = parser.parseMap(json);
    }

    public MonthlyDataEntry[] getParsedEntries(EntryType type) throws ParseException {
        switch (type){
            case EXPORT:
                return parseEntriesExport();
            case RETAIL:
                return parseEntriesRetail();
        }
        throw new CannotParseStatsTypeException("unknown stats " + type,0);
    }

    private MonthlyDataEntryExport[] parseEntriesExport() throws ParseException {
        List<List<Object>> positionValues = getPositionValuesList();
        int[] positions = new int[6];
        List<MonthlyDataEntryExport> entries = new ArrayList<>();
        for(int i = 0 ; i < positionValues.get(POSITION_EXPORT_COMMODITY).size() ; i ++){
            //for Commodity by SITC
            positions[POSITION_EXPORT_COMMODITY] = i;
            String industry = (String) ((Map) positionValues.get(POSITION_EXPORT_COMMODITY).get(i)).get("id");
            MonthlyDataEntryExport export = (MonthlyDataEntryExport)
                    EntryFactory.getFactory().getMonthlyDataEntry(industry,EntryType.EXPORT);

            //ignore Data Type position
            for(int j = 0; j < positionValues.get(POSITION_STATE).size() ; j ++){
                //for each state
                positions[POSITION_STATE] = j;
                String state = (String) ((Map) positionValues.get(POSITION_STATE).get(j)).get("id");
                RegionalDataEntry regionalDataEntry = EntryFactory.getFactory()
                        .getRegionalDataEntry(State.parseState(state));

                //ignore Adjustment Type
                //ignore Frequency

                for(int k = 0 ; k < positionValues.get(POSITION_DATE).size() ; k++){
                    //for each months
                    String dateYM = (String) ((Map) positionValues.get(POSITION_DATE).get(k)).get("id");
                    positions[POSITION_DATE] = k;
                    //for each Time period
                    regionalDataEntry.addEntry(EntryFactory.getFactory().getDateDataEntry(DateUtils.stringToDateYM(dateYM)
                            ,getDataByPositions(positions),EntryType.EXPORT));

                }
                regionalDataEntry.pack();
                export.addRegionalDataEntry(regionalDataEntry);
            }
            export.pack();
            entries.add(export);
        }
        return entries.toArray(new MonthlyDataEntryExport[entries.size()]);
    }

    private MonthlyDataEntryRetail[] parseEntriesRetail() throws ParseException {
        List<List<Object>> positionValues = getPositionValuesList();

        int[] positions = new int[6];
        List<MonthlyDataEntryRetail> entries = new ArrayList<>();
        for(int i = 0; i < positionValues.get(POSITION_RETAIL_Industry).size() ; i ++){
            //for Retail Industry
            positions[POSITION_RETAIL_Industry] = i;
            String industry = (String) ((Map) positionValues.get(POSITION_RETAIL_Industry).get(i)).get("id");
            MonthlyDataEntryRetail retail = (MonthlyDataEntryRetail)
                    EntryFactory.getFactory().getMonthlyDataEntry(industry,EntryType.RETAIL);

            //ignore Data Type position
            for(int j = 0; j < positionValues.get(POSITION_STATE).size() ; j ++){
                //for each state
                positions[POSITION_STATE] = j;
                String state = (String) ((Map) positionValues.get(POSITION_STATE).get(j)).get("id");
                RegionalDataEntry regionalDataEntry = EntryFactory.getFactory()
                        .getRegionalDataEntry(State.parseState(state));

                //ignore Adjustment Type
                //ignore Frequency

                for(int k = 0 ; k < positionValues.get(POSITION_DATE).size() ; k++){
                    //for each months
                    String dateYM = (String) ((Map) positionValues.get(POSITION_DATE).get(k)).get("id");
                    positions[POSITION_DATE] = k;
                    //for each Time period TODO: notice user when some data is missing.
                    double data = getDataByPositions(positions);
                    if(data == -1.0)
                        continue;
                    regionalDataEntry.addEntry(EntryFactory.getFactory().getDateDataEntry(DateUtils.stringToDateYM(dateYM)
                           ,data,EntryType.RETAIL));

                }
                regionalDataEntry.pack();
                retail.addRegionalDataEntry(regionalDataEntry);
            }
            retail.pack();
            entries.add(retail);
        }
        return entries.toArray(new MonthlyDataEntryRetail[entries.size()]);
    }

    private  List<List<Object>> getPositionValuesList(){
        List<List<Object>> positionValues = new ArrayList<>();
        for(int i = 0 ; i < struc.size() ; i ++){
            Map<String, Object> positionObject  = (Map) struc.get(i);
            List<Object> values = (List) positionObject.get("values");
            positionValues.add(values);
        }
        return positionValues;
    }

    private String getKeyFromPositions(int[] positions){
        StringBuilder builder = new StringBuilder();
        Arrays.stream(positions).forEach(i->{
            builder.append(i).append(":");
        });
        return builder.toString().substring(0,builder.length() -1);
    }

    private double getDataByPositions(int[] positions){
        try {
            return (double) ((List) data.get(getKeyFromPositions(positions))).get(0);
        }catch (NullPointerException e){
            return -1.0;
        }
    }


    public DataParser parse () throws CannotParseJSONException {
        if(!root.containsKey("dataSets") || !root.containsKey("structure") )
            throw new CannotParseJSONException("key: dataSets or structure do not exist!",0);
        try {
            Map<String, Object> dataSets = (Map) ((List) root.get("dataSets")).get(0);
            Map<String, Object> structure = (Map) root.get("structure");
            data = (Map) dataSets.get("observations");
            struc = (List) ((Map) structure.get("dimensions")).get("observation");
        }catch (Exception e){
            e.printStackTrace();
            throw new CannotParseJSONException(e.getMessage(),1);
        }
        return this;
    }


}
