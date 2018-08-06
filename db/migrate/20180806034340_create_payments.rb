class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.references :customer, index: true, foreign_key: true
      t.references :driver, index: true, foreign_key: true
      t.float :sum
      t.jsonb :option
    end
  end
end
