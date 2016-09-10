class AddBoxesWidthToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :boxes_width, :float
  end
end
