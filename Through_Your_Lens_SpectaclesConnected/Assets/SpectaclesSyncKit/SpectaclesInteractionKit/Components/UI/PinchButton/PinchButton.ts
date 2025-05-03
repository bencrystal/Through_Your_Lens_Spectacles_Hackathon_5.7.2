import Event from "../../../Utils/Event";
import { Interactable } from "../../Interaction/Interactable/Interactable";
import { InteractorEvent } from "../../../Core/Interactor/InteractorEvent";
import NativeLogger from "../../../Utils/NativeLogger";
import { createCallback } from "../../../Utils/InspectorCallbacks";

const TAG = "PinchButton";

/**
 * Add this script to the same SceneObject that holds an **Interactable**.
 * Exposes a public `onButtonPinched` event you can subscribe to.
 */
@component
export class PinchButton extends BaseScriptComponent {
  /* ---------- OPTIONAL INSPECTOR INPUTS ---------- */

  @input
  @hint("Enable this to add functions from another script to this component’s callback event")
  editEventCallbacks: boolean = false;

  @ui.group_start("On Button Pinched Callbacks")
  @showIf("editEventCallbacks")
  @input("Component.ScriptComponent")
  @hint("Script that contains the functions to be called when the button is pinched")
  @allowUndefined
  customFunctionForOnButtonPinched?: ScriptComponent;

  @input
  @hint("Names of the functions (strings) on the above script to call on pinch")
  @allowUndefined
  onButtonPinchedFunctionNames: string[] = [];
  @ui.group_end

  /* ---------- PRIVATE FIELDS ---------- */

  private interactable: Interactable | null = null;
  private readonly onButtonPinchedEvent = new Event<InteractorEvent>();
  public readonly onButtonPinched = this.onButtonPinchedEvent.publicApi();
  private readonly log = new NativeLogger(TAG);

  /* ---------- LIFE-CYCLE ---------- */

  /** Called first – grab the Interactable so we can wire it later */
  onAwake(): void {
    this.interactable = this.getSceneObject()
      .getComponent(Interactable.getTypeName());

    if (!this.interactable) {
      print(`❌ Interactable not found on ${this.getSceneObject().name}`);
    }
  }

  /** Called after every component is awake – safe to touch Interactable events */
  onStart(): void {
    if (!this.interactable) { return; }

    // fires whenever the pinch (trigger) ends
    this.interactable.onTriggerEnd.add((event) => {
      if (this.enabled) {
        this.onButtonPinchedEvent.invoke(event);
      }
    });

    // hook up custom callbacks listed in the Inspector
    if (this.editEventCallbacks &&
        this.customFunctionForOnButtonPinched) {
      this.onButtonPinched.add(
        createCallback<InteractorEvent>(
          this.customFunctionForOnButtonPinched,
          this.onButtonPinchedFunctionNames
        )
      );
    }
  }
}
