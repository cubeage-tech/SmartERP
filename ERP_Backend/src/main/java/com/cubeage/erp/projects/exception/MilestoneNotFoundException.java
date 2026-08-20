package com.cubeage.erp.projects.exception;
public class MilestoneNotFoundException extends RuntimeException{ public MilestoneNotFoundException(Long id){super("Milestone not found: "+id);} }
