@component
export class EmojiWheelController extends BaseScriptComponent {
  @input("Component")
  centerPinchButton!: Component

  @input("Component[]")
  emojiPinchButtons!: Component[]

  onStart() {
    print("✅ EmojiWheelController initialized")

    const centerPB = this.centerPinchButton as any
    const emojiPBs = this.emojiPinchButtons.map(pb => pb as any)

    // Disable all emoji buttons initially
    emojiPBs.forEach(pb => pb.enabled = false)

    // Register center button press
    if (centerPB?.onButtonPinched) {
      centerPB.onButtonPinched.add(() => {
        print("🎯 Center button pinched")
        emojiPBs.forEach(pb => pb.enabled = true)
      })
    } else {
      print("⚠️ centerPB is missing or doesn't have onButtonPinched")
    }

    // Register emoji presses
    emojiPBs.forEach(pb => {
      if (pb?.onButtonPinched) {
        pb.onButtonPinched.add(() => {
          print("🔘 Emoji button pinched: " + pb.sceneObject.name)

          emojiPBs.forEach(other => {
            if (other !== pb) other.enabled = false
          })

          const timer = this.createEvent("DelayedCallbackEvent")
          timer.bind(() => {
            print("🔕 Disabling emoji: " + pb.sceneObject.name)
            pb.enabled = false
          })
          timer.reset(3)
        })
      }
    })
  }
}
