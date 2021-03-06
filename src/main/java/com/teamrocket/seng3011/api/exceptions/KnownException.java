package com.teamrocket.seng3011.api.exceptions;

/**
 * Created by JHXSMatthew on 29/3/17.
 */
public class KnownException extends Exception {

    private boolean pretty = false;
    private String traceNumber = "";

    public KnownException(String message, boolean pretty) {
        super(message);
        this.pretty = pretty;
    }

    public void setPretty(boolean pretty) {
        this.pretty = pretty;
    }

    public void setTraceNumber(String s){
        this.traceNumber = s;
    }

    public String getTraceNumber(){
        return this.traceNumber ;
    }
}
