package com.hakenadu.plantuml.model;

public class Annotation {

	private final String type;
	private final Integer row;
	private final String text;

	public Annotation(final String type, final Integer row, final String text) {
		super();
		this.type = type;
		this.row = row;
		this.text = text;
	}

	public String getType() {
		return type;
	}

	public Integer getRow() {
		return row;
	}

	public String getText() {
		return text;
	}
}
