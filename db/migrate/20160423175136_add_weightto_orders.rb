class AddWeighttoOrders < ActiveRecord::Migration
  def change
    add_column :orders, :weight, :float
    add_column :orders, :goods_type, :string
    add_column :orders, :work_type, :string
    add_column :orders, :transport_type, :string
    add_column :orders, :start_date, :date
    add_column :orders, :end_date, :date
    add_column :orders, :tons_per_hour, :float
    add_column :orders, :deal_type, :string
  end
end
