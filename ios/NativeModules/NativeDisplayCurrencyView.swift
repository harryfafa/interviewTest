import Foundation
import UIKit
import React

@objc(NativeDisplayCurrencyView)
class NativeDisplayCurrencyView: UIView, UITableViewDelegate, UITableViewDataSource {
  
  private let titleLabel = UILabel()
  private let descLabel = UILabel()
  private let tableView = UITableView()
  private let confirmButton = UIButton()
  
  private let currencies = [
    ("USD", "US Dollar"),
    ("HKD", "Hong Kong Dollar"),
  ]
  
  private var selectedCode: String?

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
    
    titleLabel.text = "Display Currency"
    titleLabel.font = UIFont.boldSystemFont(ofSize: 20)
    titleLabel.textColor = .black
    
    descLabel.text = "Select your preferred display currency."
    descLabel.font = UIFont.systemFont(ofSize: 14)
    descLabel.textColor = .darkGray
    descLabel.numberOfLines = 0
    
    tableView.delegate = self
    tableView.dataSource = self
    tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
    tableView.backgroundColor = .clear
    
    confirmButton.setTitle("Confirm", for: .normal)
    confirmButton.backgroundColor = UIColor(hex: "#1C65F3")
    confirmButton.setTitleColor(.white, for: .normal)
    confirmButton.layer.cornerRadius = 12
    confirmButton.addTarget(self, action: #selector(onConfirm), for: .touchUpInside)
    
    for view in [titleLabel, descLabel, tableView, confirmButton] {
      view.translatesAutoresizingMaskIntoConstraints = false
      self.addSubview(view)
    }
    
    NSLayoutConstraint.activate([
      titleLabel.topAnchor.constraint(equalTo: self.topAnchor, constant: 16),
      titleLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16),
      
      descLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 8),
      descLabel.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16),
      descLabel.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -16),
      
      tableView.topAnchor.constraint(equalTo: descLabel.bottomAnchor, constant: 16),
      tableView.leadingAnchor.constraint(equalTo: self.leadingAnchor),
      tableView.trailingAnchor.constraint(equalTo: self.trailingAnchor),
      tableView.bottomAnchor.constraint(equalTo: confirmButton.topAnchor, constant: -16),
      
      confirmButton.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -24),
      confirmButton.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: 16),
      confirmButton.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -16),
      confirmButton.heightAnchor.constraint(equalToConstant: 50)
    ])
  }
  
  // MARK: TableView
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return currencies.count
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
    let (code, name) = currencies[indexPath.row]
    cell.textLabel?.text = "\(name) (\(code))"
    cell.accessoryType = (selectedCode == code) ? .checkmark : .none
    return cell
  }
  
  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    selectedCode = currencies[indexPath.row].0
    tableView.reloadData()
  }
  
  @objc private func onConfirm() {
    guard let code = selectedCode else { return }
    SettingsModule.sendEvent(name: "OnCurrencySelected", body: code)
  }
}
