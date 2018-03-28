# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180328025623) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.integer  "author_id"
    t.string   "author_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree

  create_table "bids", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "order_id"
    t.float    "price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "status"
  end

  add_index "bids", ["order_id"], name: "index_bids_on_order_id", using: :btree
  add_index "bids", ["user_id"], name: "index_bids_on_user_id", using: :btree

  create_table "microposts", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "message"
  end

  add_index "microposts", ["user_id"], name: "index_microposts_on_user_id", using: :btree

  create_table "orders", force: :cascade do |t|
    t.json     "source"
    t.json     "destination"
    t.integer  "user_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.float    "weight"
    t.string   "goods_type"
    t.string   "work_type"
    t.string   "transport_type"
    t.date     "start_date"
    t.date     "end_date"
    t.float    "tons_per_hour"
    t.string   "deal_type"
    t.float    "fixed_price"
    t.string   "description"
    t.datetime "pickup_time"
    t.datetime "pickup_ready_time"
    t.datetime "pickup_cutoff_time"
    t.datetime "delivery_time"
    t.datetime "delivery_deliver_after_time"
    t.datetime "delivery_cutoff_time"
    t.string   "contact_info"
    t.integer  "pallets_count"
    t.float    "pallets_height"
    t.float    "pallets_length"
    t.float    "pallets_width"
    t.integer  "boxes_count"
    t.float    "boxes_height"
    t.float    "boxes_length"
    t.float    "boxes_width"
    t.float    "distance"
    t.integer  "selected_bid_id"
    t.string   "status"
  end

  add_index "orders", ["selected_bid_id"], name: "index_orders_on_selected_bid_id", using: :btree

  create_table "user_locations", force: :cascade do |t|
    t.integer  "user_id"
    t.float    "latitude"
    t.float    "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "user_locations", ["user_id"], name: "index_user_locations_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "role"
    t.time     "last_asked"
    t.string   "type"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "bids", "orders"
  add_foreign_key "bids", "users"
  add_foreign_key "microposts", "users"
  add_foreign_key "orders", "bids", column: "selected_bid_id"
  add_foreign_key "user_locations", "users"
end
