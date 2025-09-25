import Foundation
import UIKit
import React

@objc(NativeSettingsView)
class NativeSettingsView: UIView {
  
  private let avatarImageView = UIImageView()
  private let walletLabel = UILabel()
  private let accountLabel = UILabel()   // 👈 新增 Account 標題
  private let currencyLabel = UILabel()
  private let displayCurrencyRow = UIControl()
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupUI()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupUI()
  }
  
  private func setupUI() {
    self.backgroundColor = UIColor(hex: "#F5F6F7")
    
    // Avatar
    avatarImageView.translatesAutoresizingMaskIntoConstraints = false
    avatarImageView.layer.cornerRadius = 40
    avatarImageView.clipsToBounds = true
    avatarImageView.backgroundColor = UIColor(hex: "#F5F6F7")
    avatarImageView.image = UIImage(named: "avatar_placeholder")
    self.addSubview(avatarImageView)
    
    // Wallet Label
    walletLabel.translatesAutoresizingMaskIntoConstraints = false
    walletLabel.text = "Wallet 1 ▼"
    walletLabel.textColor = .black
    walletLabel.font = UIFont.boldSystemFont(ofSize: 18)
    self.addSubview(walletLabel)
    
    // Account Label 👇
    accountLabel.translatesAutoresizingMaskIntoConstraints = false
    accountLabel.text = "Account"
    accountLabel.textColor = .black
    accountLabel.font = UIFont.systemFont(ofSize: 14, weight: .regular)
    self.addSubview(accountLabel)
    
    // Display Currency Row
    displayCurrencyRow.backgroundColor = UIColor(hex: "#CDEAFE")
    displayCurrencyRow.layer.cornerRadius = 12
    displayCurrencyRow.clipsToBounds = true
    displayCurrencyRow.translatesAutoresizingMaskIntoConstraints = false
    self.addSubview(displayCurrencyRow)
    
    // Row 裡的 Label
    let titleLabel = UILabel()
    titleLabel.text = "Display Currency"
    titleLabel.textColor = .black
    titleLabel.font = UIFont.systemFont(ofSize: 16)
    titleLabel.translatesAutoresizingMaskIntoConstraints = false
    
    currencyLabel.translatesAutoresizingMaskIntoConstraints = false
    currencyLabel.text = "HKD"
    currencyLabel.textColor = .lightGray
    currencyLabel.font = UIFont.systemFont(ofSize: 14)
    
    displayCurrencyRow.addSubview(titleLabel)
    displayCurrencyRow.addSubview(currencyLabel)
    
    displayCurrencyRow.addTarget(self, action: #selector(onDisplayCurrencyPress), for: .touchUpInside)
    
    NSLayoutConstraint.activate([
      // Avatar
      avatarImageView.topAnchor.constraint(equalTo: self.topAnchor, constant: 40),
      avatarImageView.centerXAnchor.constraint(equalTo: self.centerXAnchor),
      avatarImageView.widthAnchor.constraint(equalToConstant: 80),
      avatarImageView.heightAnchor.constraint(equalToConstant: 80),
      
      // Wallet Label
      walletLabel.topAnchor.constraint(equalTo: avatarImageView.bottomAnchor, constant: 12),
      walletLabel.centerXAnchor.constraint(equalTo: self.centerXAnchor),
      
      // Account Label
      accountLabel.topAnchor.constraint(equalTo: walletLabel.bottomAnchor, constant: 32),
      accountLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16),
      
      // Display Currency Row
      displayCurrencyRow.topAnchor.constraint(equalTo: accountLabel.bottomAnchor, constant: 8),
      displayCurrencyRow.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16),
      displayCurrencyRow.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -16),
      displayCurrencyRow.heightAnchor.constraint(equalToConstant: 50),
      
      // 左邊文字：加 16pt 左邊距
      titleLabel.centerYAnchor.constraint(equalTo: displayCurrencyRow.centerYAnchor),
      titleLabel.leadingAnchor.constraint(equalTo: displayCurrencyRow.leadingAnchor, constant: 16),
      
      // 右邊文字：加 16pt 右邊距
      currencyLabel.centerYAnchor.constraint(equalTo: displayCurrencyRow.centerYAnchor),
      currencyLabel.trailingAnchor.constraint(equalTo: displayCurrencyRow.trailingAnchor, constant: -16)
    ])
  }
  
  // MARK: - Props from React
  @objc var currency: NSString = "HKD" {
    didSet {
      self.currencyLabel.text = currency as String
    }
  }

  @objc var avatarUrl: NSString? {
    didSet {
      if let urlStr = avatarUrl as String?, let url = URL(string: urlStr) {
        DispatchQueue.global().async {
          if let data = try? Data(contentsOf: url), let img = UIImage(data: data) {
            DispatchQueue.main.async {
              self.avatarImageView.image = img
            }
          }
        }
      } else {
        self.avatarImageView.image = UIImage(named: "avatar_placeholder")
      }
    }
  }

  // MARK: - Events
  @objc private func onDisplayCurrencyPress() {
    SettingsModule.sendEvent(name: "OnDisplayCurrencyPress", body: nil)
  }
}
