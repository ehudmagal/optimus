class AddOptionsToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :options, :jsonb
  end
end
