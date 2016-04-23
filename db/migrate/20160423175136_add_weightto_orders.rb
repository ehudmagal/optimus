class AddWeighttoOrders < ActiveRecord::Migration
  def change
    add_column :orders, :weight, :float
    add_column :orders, :goods_type, :string
    add_column :orders, :goods_type, :string
  end
end
