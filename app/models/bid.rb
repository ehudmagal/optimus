class Bid < ActiveRecord::Base
  belongs_to :user
  belongs_to :order
  def json_attributes
    json = as_json
    json['order'] = order.json_attributes
    json
  end
end