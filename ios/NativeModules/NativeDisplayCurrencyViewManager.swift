import Foundation
import React

@objc(NativeDisplayCurrencyViewManager)
class NativeDisplayCurrencyViewManager: RCTViewManager {
  override func view() -> UIView! {
    return NativeDisplayCurrencyView()
  }
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
