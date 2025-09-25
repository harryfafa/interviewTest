import Foundation
import React

@objc(SettingsModule)
class SettingsModule: RCTEventEmitter {
  
  private static var shared: SettingsModule?
  
  override init() {
    super.init()
    SettingsModule.shared = self
  }
  
  @objc override static func moduleName() -> String! {
    return "SettingsModule"
  }
  
  @objc override func supportedEvents() -> [String]! {
    return ["OnDisplayCurrencyPress", "OnCurrencySelected"]
  }
  
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  static func sendEvent(name: String, body: Any?) {
    shared?.sendEvent(withName: name, body: body)
  }
}
