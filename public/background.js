

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.startsWith("http")) {
    chrome.storage.local.get(["currentGoal", "areWorking"], async (result) => {
      const { currentGoal, areWorking } = result;
      if (areWorking && currentGoal) {
        const decision = await checkWithAI(changeInfo.url, currentGoal);
        console.log("AI DECISION: " + decision);
        if (decision.startsWith("no")) {
          chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              const stay = window.confirm("This site is not relavent to your goal. Close this site?");
              if (stay) {
                chrome.runtime.sendMessage({ type: "CLOSE_THIS_TAB" });
              }
            }
          });
        }
      }
    });
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_GOAL") {
    const goal = message.goal;
    console.log("Received goal from popup:", goal);

    // Save it to storage, use it in tab monitoring, etc.
    chrome.storage.local.set({ currentGoal: goal });
  } 
  if (message.type === "WORKING") {
    const goal = message.goal;
    console.log("Updating working from popup:", goal);
    chrome.storage.local.set({ areWorking: goal });
  }
  if (message.type === "CLOSE_THIS_TAB" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});

//ai api processing
async function checkWithAI(url, goal) {
  const userInput = `Give the answer to the following as strictly either "yes", or "no". Given the following website url: ${url} And given the following task/goal: ${goal} Is the website the user is on relevant to completing the task? Be lenient. If it could be related, assume it is. Be strict when it comes to websites that are obviously distracting such as social medias but lenient with anything else that could be related. BE VERY LENIENT PLEASE!`;

  try {
    const res = await fetch("http://localhost:3001", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await res.json();
    console.log("AI response:", data.text);
    return data.text.trim().toLowerCase();
  } catch (err) {
    console.error("Error contacting AI backend:", err);
    return "yes"; // fallback to avoid being too aggressive
  }
}