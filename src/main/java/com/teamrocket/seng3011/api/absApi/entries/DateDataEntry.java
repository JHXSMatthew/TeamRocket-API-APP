package com.teamrocket.seng3011.api.absApi.entries;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.teamrocket.seng3011.utils.DateUtils;

import java.util.Date;

/**
 * Created by JHXSMatthew on 19/03/2017.
 */
public abstract class DateDataEntry {
    @JsonProperty("Date")
    //TODO: date should be convented to yyyy-MM-dd where dd is the last day of the month.
    private String date;

    public DateDataEntry(Date date) {
        this.date = DateUtils.dateToStringYMD(date);
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
