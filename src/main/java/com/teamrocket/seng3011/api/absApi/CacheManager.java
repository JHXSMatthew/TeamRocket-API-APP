package com.teamrocket.seng3011.api.absApi;

import com.teamrocket.seng3011.api.APIConfiguration;
import com.teamrocket.seng3011.api.APIController;
import com.teamrocket.seng3011.api.absApi.entries.DateDataEntry;
import com.teamrocket.seng3011.api.absApi.entries.EntryType;
import com.teamrocket.seng3011.api.exceptions.CannotParseStatsTypeException;
import com.teamrocket.seng3011.utils.DateRange;
import com.teamrocket.seng3011.utils.DateRangeComparator;
import com.teamrocket.seng3011.utils.DateUtils;
import redis.clients.jedis.*;

import java.util.*;

/**
 * Created by JHXSMatthew on 23/4/17.
 */
public class CacheManager {

    static {
        getManager();
    }

    private static CacheManager manager = null;

    private JedisPool pool;



    public CacheManager(){
        manager = this;
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(1000); //TODO: change this while production
        config.setMaxWaitMillis(1000);
        try{
            pool = new JedisPool(config,"localhost",6379);
            APIConfiguration.cache = true;
            APIController.debugPrint("Cache enabled.");

        }catch (Exception e){
            e.printStackTrace();
            manager = null;
            APIConfiguration.cache = false;
            APIController.debugPrint("Redis connection failed, drop cache functionality..");

        }
    }


    private String getKey(int area,int category, int region){
        return area+":"+category+":"+region;
    }

    private void dump(int area,int category,int region, String msg, Date ... date){
        APIController.debugPrint("[d] " + msg + " " + getKey(area,category,region)  );

        Arrays.stream(date).forEach(d->{
            APIController.debugPrint(DateUtils.dateToStringYMD(d));
        });
    }

    public boolean isCached(int area, int category, int region, Date start, Date end){
        String key = getKey(area,category,region);
        Jedis jedis = pool.getResource();
        try {
            String range = jedis.hget(key, "range");
            if (range == null) {
                dump(area, category, region, "range null", start, end);
                return false;
            }
            List<DateRange> ranges = DateUtils.stringToDataRange(range);
            for (DateRange r : ranges) {
                if (r.isInRange(start) && r.isInRange(end)) {
                    return true;
                }
                APIController.debugPrint(" Range: " + r.toString());
                APIController.debugPrint(" " + DateUtils.dateToStringYMD(start) + " " + r.isInRange(start));
                APIController.debugPrint(" " + DateUtils.dateToStringYMD(end) + " " + r.isInRange(end));
            }
            dump(area, category, region, "Cached false", start, end);
            return false;
        }finally {
            jedis.close();
        }
    }


    /**
     *  cache the actual data
     * @param area
     * @param category
     * @param region
     * @param date
     * @param data
     */
    public void cache(int area, int category, int region, String date,String data){
        Jedis jedis = pool.getResource();
        try {
            jedis.hsetnx(getKey(area, category, region), date, data);
        }finally {
            jedis.close();

        }
    }

    /**
     *  cache the date range , fast looking up
     * @param area
     * @param category
     * @param region
     * @param starting
     * @param end
     */
    public void cache (int area, int category, int region, Date starting, Date end){
        Jedis jedis = pool.getResource();
        String key = getKey(area,category,region);
        String raw = jedis.hget(key,"range");
        try {
            List<DateRange> ranges;
            if (raw == null || raw.equals("")) {
                ranges = new ArrayList<>();
            } else {
                ranges = DateUtils.stringToDataRange(raw);
            }
            ranges.add(new DateRange(starting, end));
            Collections.sort(ranges, new DateRangeComparator());

            List<DateRange> merged = merge(ranges);

            //TODO; check concurrent modification of redis cache, don't know if it is ok without transaction.
            jedis.hset(key, "range", DateUtils.dateRangeToString(merged));
        }finally {
            jedis.close();
        }
    }

    private List<DateRange> merge(List<DateRange> ranges){
        if(ranges.size() == 1 || ranges.isEmpty())
            return ranges;
        boolean merged = false;
        List<DateRange> next = new ArrayList<>();
        for(int i = 1 ; i < ranges.size() ; i ++){
            try {
                next.add(ranges.get(i).merge(ranges.get(i-1)));
                ranges.remove(i);
                ranges.remove(i-1);
                merged = true;
                break;
            } catch (Exception e) {
                if(!e.getMessage().contains("Cannot merge date range")) {
                    e.printStackTrace();
                }

            }
        }
        next.addAll(ranges);
        if(merged){
            return merge(next);
        }else{
            return next;
        }
    }



    public DateDataEntry[] getCache(int area, int category, int region, Date start, Date end) throws CannotParseStatsTypeException {
        List<DateDataEntry> returnValue = new ArrayList<>();
        String key = getKey(area,category,region);
        Jedis jedis = pool.getResource();
        try {
            Calendar s = Calendar.getInstance();
            Calendar e = Calendar.getInstance();
            s.set(Calendar.DAY_OF_MONTH, 1);
            e.set(Calendar.DAY_OF_MONTH, 1);
            s.setTime(start);
            e.setTime(end);
            int loopMax = (e.get(Calendar.YEAR) - s.get(Calendar.YEAR)) * 12 + (e.get(Calendar.MONTH) - s.get(Calendar.MONTH)) + 1;
            for (int i = 0; i < loopMax; i++) {
                s.add(Calendar.MONTH, 1);
                s.add(Calendar.DATE, -1);
                double value = -1.0;
                try {
                    value = Double.parseDouble(jedis.hget(key, DateUtils.dateToStringYMD(s.getTime())));
                }catch (Exception ee){
                    //TODO: ignore this ?
                }
                if(value != -1.0) {
                    returnValue.add(EntryFactory.getFactory().getDateDataEntry(
                            s.getTime(),
                            value,
                            EntryType.parseType(area)
                    ));
                }

                s.set(Calendar.DAY_OF_MONTH, 1);
                s.add(Calendar.MONTH, 1);
            }
            return returnValue.toArray(new DateDataEntry[returnValue.size()]);
        }finally {
            jedis.close();
        }
    }

    public static CacheManager getManager(){
        if(manager == null){
            manager = new CacheManager();
        }
        return manager;
    }

}