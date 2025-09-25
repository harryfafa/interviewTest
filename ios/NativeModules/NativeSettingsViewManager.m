#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(NativeSettingsViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(currency, NSString)
RCT_EXPORT_VIEW_PROPERTY(avatarUrl, NSString)
@end
