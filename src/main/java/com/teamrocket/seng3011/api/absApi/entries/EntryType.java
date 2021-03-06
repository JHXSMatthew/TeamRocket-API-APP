package com.teamrocket.seng3011.api.absApi.entries;

import com.teamrocket.seng3011.api.exceptions.CannotParseStatsTypeException;

/**
 * Created by JHXSMatthew on 19/03/2017.
 */
public enum EntryType {
    EXPORT("MerchandiseExports",1), RETAIL("Retail",0);

    private String typeString;
    private int cache;
    EntryType(String str,int cacheId) {
        this.typeString = str;
        this.cache = cacheId;
    }

    public static EntryType parseType(String arg) throws CannotParseStatsTypeException {
        for (EntryType type : values()) {
            if (type.typeString.equals(arg))
                return type;
        }
        throw new CannotParseStatsTypeException(arg);
    }

    public static EntryType parseType(int arg) throws CannotParseStatsTypeException {
        for (EntryType type : values()) {
            if (type.cache == arg)
                return type;
        }
        throw new CannotParseStatsTypeException(String.valueOf(arg));
    }

    public String getTypeString(){
        return typeString;
    }

    public int getCacheKey(){
        return cache;
    }
}
