class AddBoxesHeightToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :boxes_height, :float
  end
end
