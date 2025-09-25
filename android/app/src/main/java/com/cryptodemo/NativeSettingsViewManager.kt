package com.cryptodemo

import android.content.Context
import android.view.LayoutInflater
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import com.bumptech.glide.Glide
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

// 原生 Settings View
class NativeSettingsView(context: Context) : LinearLayout(context) {
    private var currentCurrencyText: TextView
    private var avatarImageView: ImageView
    private var displayCurrencyRow: LinearLayout

    init {
        orientation = VERTICAL
        LayoutInflater.from(context).inflate(R.layout.activity_settings, this, true)

        currentCurrencyText = findViewById(R.id.currentCurrency)
        avatarImageView = findViewById(R.id.avatar)
        displayCurrencyRow = findViewById(R.id.displayCurrencyRow)

        // ✅ 點擊事件：通知 RN
        displayCurrencyRow.setOnClickListener {
            sendEvent("OnDisplayCurrencyPress", null)
        }
    }

    fun setCurrency(currency: String) {
        currentCurrencyText.text = currency
    }

    fun setAvatar(url: String?) {
        if (url.isNullOrEmpty()) {
            avatarImageView.setImageResource(R.drawable.avatar_placeholder)
            return
        }

        Glide.with(context)
            .load(url)
            .placeholder(R.drawable.avatar_placeholder)
            .error(R.drawable.avatar_placeholder)
            .into(avatarImageView)
    }

    private fun sendEvent(eventName: String, data: String?) {
        val reactContext = context as? ReactContext ?: return
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }
}

// Manager：讓 RN 可以用 <NativeSettingsView />
class NativeSettingsViewManager : SimpleViewManager<NativeSettingsView>() {
    override fun getName() = "NativeSettingsView"

    override fun createViewInstance(reactContext: ThemedReactContext): NativeSettingsView {
        return NativeSettingsView(reactContext)
    }

    @ReactProp(name = "currency")
    fun setCurrency(view: NativeSettingsView, currency: String) {
        view.setCurrency(currency)
    }

    @ReactProp(name = "avatarUrl")
    fun setAvatar(view: NativeSettingsView, url: String?) {
        view.setAvatar(url)
    }
}
