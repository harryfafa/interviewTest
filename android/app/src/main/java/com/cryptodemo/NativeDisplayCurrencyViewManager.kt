package com.cryptodemo

import android.content.Context
import android.view.LayoutInflater
import android.widget.*
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class NativeDisplayCurrencyView(context: Context) : LinearLayout(context) {
    private var listView: ListView
    private var confirmButton: Button
    private var selectedCode: String? = null

    // 幣別清單 (顯示用名稱 to 縮寫)
    private val currencies = listOf(
        Pair("US Dollar (USD)", "USD"),
        Pair("Hong Kong Dollar (HKD)", "HKD"),
    )

    init {
        orientation = VERTICAL
        LayoutInflater.from(context).inflate(R.layout.activity_display_currency, this, true)

        listView = findViewById(R.id.currencyList)
        confirmButton = findViewById(R.id.confirmButton)

        // 顯示用 ArrayAdapter，只用名稱 (Pair.first)
        val adapter = ArrayAdapter(
            context,
            android.R.layout.simple_list_item_single_choice,
            currencies.map { it.first }
        )
        listView.adapter = adapter
        listView.choiceMode = ListView.CHOICE_MODE_SINGLE

        listView.setOnItemClickListener { _, _, position, _ ->
            selectedCode = currencies[position].second // 記錄代碼
        }

        confirmButton.setOnClickListener {
            selectedCode?.let {
                sendEvent("OnCurrencySelected", it) // 回傳代碼
            }
        }
    }

    private fun sendEvent(eventName: String, data: String?) {
        val reactContext = context as? ReactContext ?: return
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, data)
    }
}

class NativeDisplayCurrencyViewManager : SimpleViewManager<NativeDisplayCurrencyView>() {
    override fun getName() = "NativeDisplayCurrencyView"

    override fun createViewInstance(reactContext: ThemedReactContext): NativeDisplayCurrencyView {
        return NativeDisplayCurrencyView(reactContext)
    }
}
