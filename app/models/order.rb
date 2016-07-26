class Order < ActiveRecord::Base
  belongs_to :user

  def json_attributes
    json = as_json
    json['user'] = user
    json['bids'] = bids.map{|bid| bid.json_attributes}
    json
  end
end
