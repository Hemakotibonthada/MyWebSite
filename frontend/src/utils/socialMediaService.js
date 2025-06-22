// frontend/src/utils/socialMediaService.js

export const fetchUserSocialAccounts = async () => {
    // Mock data for connected accounts
    return [
        { platform: "Facebook", username: "johndoe.fb" },
        { platform: "Instagram", username: "johndoe_ig" },
        { platform: "Twitter", username: "@johndoe_tw" },
        { platform: "LinkedIn", username: "johndoe.linkedin" },
    ];
};

export const fetchSocialMediaFeeds = async (platform) => {
    // Mock feeds for each platform
    const mockFeeds = {
        Facebook: [
            { title: "New Post", content: "Had a great day!", date: "2024-12-17" },
            { title: "Event", content: "Attended a tech conference.", date: "2024-12-16" },
        ],
        Instagram: [
            { title: "Photo", content: "Posted a beautiful sunset photo.", date: "2024-12-15" },
            { title: "Story", content: "Shared a weekend story.", date: "2024-12-14" },
        ],
        Twitter: [
            { title: "Tweet", content: "Learning React is amazing!", date: "2024-12-13" },
            { title: "Tweet", content: "Excited about my IoT project.", date: "2024-12-12" },
        ],
        LinkedIn: [
            { title: "Update", content: "Started a new role at Tech Solutions.", date: "2024-12-11" },
            { title: "Article", content: "Wrote about IoT advancements.", date: "2024-12-10" },
        ],
    };

    return mockFeeds[platform] || [];
};