package org.example.model;

public class Profile {
    private String name;
    private int age;
    private String languagePreference;
    private String memberSince;
    private int practiceGoalMinutes;

    public Profile() {}

    public Profile(String name, int age, String languagePreference, String memberSince, int practiceGoalMinutes) {
        this.name = name;
        this.age = age;
        this.languagePreference = languagePreference;
        this.memberSince = memberSince;
        this.practiceGoalMinutes = practiceGoalMinutes;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getLanguagePreference() { return languagePreference; }
    public void setLanguagePreference(String languagePreference) { this.languagePreference = languagePreference; }
    public String getMemberSince() { return memberSince; }
    public void setMemberSince(String memberSince) { this.memberSince = memberSince; }
    public int getPracticeGoalMinutes() { return practiceGoalMinutes; }
    public void setPracticeGoalMinutes(int practiceGoalMinutes) { this.practiceGoalMinutes = practiceGoalMinutes; }
}
