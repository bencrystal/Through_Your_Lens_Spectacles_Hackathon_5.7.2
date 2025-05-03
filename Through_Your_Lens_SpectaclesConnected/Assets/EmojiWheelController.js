//@input Component.Component centerPinchButton
//@input Component.Component[] emojiPinchButtons

function asPinchButton(comp) {
    const PINCH_TYPE = "Packages.SpectaclesInteractionKit.Components.UI.PinchButton.PinchButton";
    if (comp && comp.isOfType(PINCH_TYPE)) {
        print("✅ Valid PinchButton found: " + comp.getSceneObject().name);
        return comp;
    } else {
        print("❌ Invalid PinchButton: " + (comp ? comp.getTypeName() : "null"));
        return null;
    }
}

function onStart() {
    print("🚀 onStart() called");

    const centerPB = asPinchButton(script.centerPinchButton);
    const emojiPBs = (script.emojiPinchButtons || []).map(asPinchButton).filter(Boolean);

    emojiPBs.forEach(pb => pb.enabled = false);

    if (centerPB) {
        print("👋 Setting up center button listener");
        centerPB.onButtonPinched.add(() => {
            print("🎯 Center button pinched");
            emojiPBs.forEach(pb => pb.enabled = true);
        });
    } else {
        print("⚠️ Center button missing or wrong type");
    }

    emojiPBs.forEach(pb => {
        pb.onButtonPinched.add(() => {
            print("🔘 Emoji button pinched: " + pb.getSceneObject().name);
            emojiPBs.forEach(other => {
                if (other !== pb) other.enabled = false;
            });

            const timer = script.createEvent("DelayedCallbackEvent");
            timer.bind(() => {
                print("🔕 Disabling emoji: " + pb.getSceneObject().name);
                pb.enabled = false;
            });
            timer.reset(3);
        });
    });
}
