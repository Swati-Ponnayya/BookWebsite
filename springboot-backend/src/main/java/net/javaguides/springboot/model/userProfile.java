package net.javaguides.springboot.model;

public class userProfile {
	  private String fullName;
	    private String address;
	    private String phoneNumber;

	    public userProfile() {
	    }

	    public userProfile(String fullName, String address, String phoneNumber) {
	        this.fullName = fullName;
	        this.address = address;
	        this.phoneNumber = phoneNumber;
	    }

	    public String getFullName() {
	        return fullName;
	    }

	    public void setFullName(String fullName) {
	        this.fullName = fullName;
	    }

	    public String getAddress() {
	        return address;
	    }

	    public void setAddress(String address) {
	        this.address = address;
	    }

	    public String getPhoneNumber() {
	        return phoneNumber;
	    }

	    public void setPhoneNumber(String phoneNumber) {
	        this.phoneNumber = phoneNumber;
	    }
}
