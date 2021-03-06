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
            init();
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
            init();
        }catch (Exception e){
            starting = null;
            ending = null;
            e.printStackTrace();
        }

    }

    public DateRange(Calendar starting, Calendar ending){
        this.starting = starting;
        this.ending = ending;
        if(starting != null && ending != null) {
            init();
        }
    }

    private void init(){
        starting = DateUtils.setDateToLastInMonth(starting);
        ending = DateUtils.setDateToLastInMonth(ending);
        starting = DateUtils.setTimeToMidnight(starting);
        ending = DateUtils.setTimeToMidnight(ending);
    }

    public boolean isInRange(Calendar morph){
        morph = DateUtils.setTimeToMidnight(morph);
        morph = DateUtils.setDateToLastInMonth(morph);
        return  morph.after(starting) && morph.before(ending)
                || morph.equals(ending) || morph.equals(starting);

       /* return morph.get(Calendar.YEAR) >= starting.get(Calendar.YEAR)
                && morph.get(Calendar.YEAR) <= ending.get(Calendar.YEAR)
                &&
                ( morph.get(Calendar.YEAR) == starting.get(Calendar.YEAR)    //same year as starting, month should >= than starting month
                            && morph.get(Calendar.MONTH) >= starting.get(Calendar.MONTH)
                        || morph.get(Calendar.YEAR) == ending.get(Calendar.YEAR)  //same year as ending , month should <= than ending month
                            && morph.get(Calendar.MONTH) <= ending.get(Calendar.MONTH)
                        || morph.get(Calendar.YEAR) != starting.get(Calendar.YEAR)
                            && morph.get(Calendar.YEAR) != ending.get(Calendar.YEAR));
                            */
    }

    public boolean isInRange(Date morph){
        Calendar temp = Calendar.getInstance();
        temp.setTime(morph);
        return isInRange(temp);
    }

    /**
     *
     * @param a
     * @param b
     * @return true if a and b are two continuous date
     */
    public boolean continuous(Calendar a, Calendar b){
        return Math.abs(a.get(Calendar.YEAR) - b.get(Calendar.YEAR)) == 0
                && Math.abs(a.get(Calendar.MONTH) - b.get(Calendar.MONTH)) == 1;
    }

    public boolean before(DateRange range){
        return !after(range);
    }

    public boolean after(DateRange range){
        return starting.after(range.starting);
        /*
        return starting.get(Calendar.YEAR) > range.starting.get(Calendar.YEAR)  ||
                starting.get(Calendar.YEAR) == range.starting.get(Calendar.YEAR) &&
                        starting.get(Calendar.MONTH) > range.starting.get(Calendar.MONTH);
                        */
    }

    public DateRange merge(DateRange range) throws Exception {
        return merge(range,true);
    }

    private DateRange merge(DateRange range, boolean otherWay) throws Exception {
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
        if(otherWay) {
            return range.merge(this, false);
        }
        throw new Exception("Cannot merge date range, not legit");
    }


    public String toString(){
        return DateUtils.dateToStringYMD(starting.getTime()) + " ~ " + DateUtils.dateToStringYMD(ending.getTime());
    }

    public Calendar getStarting() {
        return starting;
    }

    public Calendar getEnding() {
        return ending;
    }
}
