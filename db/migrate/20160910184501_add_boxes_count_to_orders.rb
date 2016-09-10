class AddBoxesCountToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :boxes_count, :integer
  end
end
