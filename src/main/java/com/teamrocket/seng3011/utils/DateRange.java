package com.teamrocket.seng3011.utils;

import java.util.Calendar;
import java.util.Date;

/**
 * Created by JHXSMatthew on 23/4/17.
 */
public class DateRange {

    private Calendar starting ;
    private Calendar ending;

    public DateRange(String starting, String ending){
        this.starting = Calendar.getInstance();
        this.ending = Calendar.getInstance();
        try {
            this.starting.setTime(DateUtils.stringToDateYMD(starting));
            this.ending.setTime(DateUtils.stringToDateYMD(ending));
        }catch (Exception e){
            starting = null;
            ending = null;
            e.printStackTrace();
        }
    }

    public DateRange(Date starting, Date ending){
        this.starting = Calendar.getInstance();
        this.ending = Calendar.getInstance();
        try {
            this.starting.setTime(starting);
            this.ending.setTime(ending);
        }catch (Exception e){
            starting = null;
            ending = null;
            e.printStackTrace();
        }
    }

    public DateRange(Calendar starting, Calendar ending){
        this.starting = starting;
        this.ending = ending;
    }


    public boolean isInRange(Calendar morph){
        return morph.get(Calendar.MONTH) >= starting.get(Calendar.MONTH)
                && morph.get(Calendar.MONTH) <= ending.get(Calendar.MONTH);
    }

    public boolean isInRange(Date morph){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(morph);
        return calendar.get(Calendar.MONTH) >= starting.get(Calendar.MONTH)
                && calendar.get(Calendar.MONTH) <= ending.get(Calendar.MONTH);
    }

    /**
     *
     * @param a
     * @param b
     * @return true if a and b are two continuous date
     */
    public boolean continuous(Calendar a, Calendar b){
        return Math.abs(a.get(Calendar.MONTH) - b.get(Calendar.MONTH)) == 1;
    }

    public DateRange merge(DateRange range) throws Exception {
        if(isInRange(range.starting)){
            if(isInRange(range.ending)){
                return this;
            }else{
                return new DateRange(starting,range.ending);
            }
        }else if(isInRange(range.ending)){
            return new DateRange(range.starting,ending);
        }else{
            if(continuous(ending,range.starting)){
                return new DateRange(starting,range.ending);
            }else if(continuous(range.ending,starting)){
                return new DateRange(range.starting,ending);
            }
        }
        throw new Exception("Cannot merge date range, not legit");
    }

    public Calendar getStarting() {
        return starting;
    }

    public void setStarting(Calendar starting) {
        this.starting = starting;
    }

    public Calendar getEnding() {
        return ending;
    }

    public void setEnding(Calendar ending) {
        this.ending = ending;
    }
}
