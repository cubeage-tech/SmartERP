package com.cubeage.erp.projects.exception;
public class TimesheetNotFoundException extends RuntimeException{ public TimesheetNotFoundException(Long id){super("Timesheet not found: "+id);} }
