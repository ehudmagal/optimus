class AddWorkTypeToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :work_type, :json
  end
end
