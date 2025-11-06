package com.qonaqui.model.embedded;

import java.util.List;

public class ServiceAvailability {

    private List<String> days;
    private List<String> hours;

    public List<String> getDays() {
        return days;
    }

    public void setDays(List<String> days) {
        this.days = days;
    }

    public List<String> getHours() {
        return hours;
    }

    public void setHours(List<String> hours) {
        this.hours = hours;
    }
}
