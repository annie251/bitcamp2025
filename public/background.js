
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        let currentGoal;
        let areWorking;
        chrome.storage.local.get("currentGoal", (result) => {
            currentGoal = result.currentGoal;
            console.log("Goal from storage:", result.currentGoal);
        });
        chrome.storage.local.get("areWorking", (result) => {
          areWorking = result.areWorking;
          console.log("Are working:", result.areWorking);
      });
        if (areWorking && currentGoal) {
            confirm("hello world")
        }
    }
  });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_GOAL") {
    const goal = message.goal;
    console.log("Received goal from popup:", goal);

    // Save it to storage, use it in tab monitoring, etc.
    chrome.storage.local.set({ currentGoal: goal });
  } else if (message.type === "WORKING") {
    const goal = message.goal;
    chrome.storage.local.set({ areWorking: goal });
  }
});