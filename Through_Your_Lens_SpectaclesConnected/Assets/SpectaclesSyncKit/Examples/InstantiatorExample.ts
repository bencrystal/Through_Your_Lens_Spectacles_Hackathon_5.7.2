import {InstantiationOptions, Instantiator} from "../Components/Instantiator"
import { NetworkRootInfo } from "../Core/NetworkRootInfo"
import {SyncKitLogger} from "../Utils/SyncKitLogger"

@component
export class InstantiatorExample extends BaseScriptComponent {
  private readonly log: SyncKitLogger = new SyncKitLogger(
    InstantiatorExample.name
  )
  private newObj: SceneObject
  @input()
  instantiator: Instantiator

  @input()
  prefab: ObjectPrefab

  @input()
  cameraObj: SceneObject

  onAwake() {
    this.instantiator.notifyOnReady(() => {
      this.onReady()
    })
  }

  onReady() {
    this.instantiator.instantiate(
      this.prefab,
      {},
      (networkRootInfo: NetworkRootInfo) => {
        this.newObj = networkRootInfo.instantiatedObject;
        print('instantiated new object: ' + this.newObj);
      }
    );

    this.createEvent("UpdateEvent").bind(()=>{
      if(this.newObj){

        let cameraPos = this.cameraObj.getTransform().getWorldPosition();
        this.newObj.getTransform().setWorldPosition(cameraPos);
      }
    })
  }
}
