import Foundation
import React

@objc(NativeSettingsViewManager)
class NativeSettingsViewManager: RCTViewManager {
  override func view() -> UIView! {
    return NativeSettingsView()
  }
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
