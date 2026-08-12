package org.example.profile;

import org.example.model.Profile;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private Profile profile = new Profile("Priya Patel", 22, "Hindi & English", "January 2025", 15);

    public synchronized Profile get() {
        return profile;
    }

    public synchronized Profile update(Profile updated) {
        if (updated.getName() == null || updated.getName().isBlank()) {
            updated.setName(profile.getName());
        }
        if (updated.getAge() <= 0) {
            updated.setAge(profile.getAge());
        }
        if (updated.getLanguagePreference() == null || updated.getLanguagePreference().isBlank()) {
            updated.setLanguagePreference(profile.getLanguagePreference());
        }
        if (updated.getMemberSince() == null || updated.getMemberSince().isBlank()) {
            updated.setMemberSince(profile.getMemberSince());
        }
        if (updated.getPracticeGoalMinutes() <= 0) {
            updated.setPracticeGoalMinutes(profile.getPracticeGoalMinutes());
        }
        profile = updated;
        return profile;
    }
}
