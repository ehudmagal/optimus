class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.integer :customer_id, index: true
      t.integer :driver_id, index: true
      t.float :sum
      t.jsonb :option
    end
  end
end
