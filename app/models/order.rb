class Order < ActiveRecord::Base
  belongs_to :user
  has_many :bids
  before_save :set_bids_status

  def json_attributes
    json = as_json
    json['user'] = user
    json['bids'] = bids.map { |bid| bid.json_attributes }
    json
  end

  def set_bids_status
    unless selected_bid_id.nil?
      over_bids = bids.where.not(id: selected_bid_id)
      cancelled_bids.each do |bid|
        bid.update status: 'over'
      end
      selected_bid = bids.where(id: selected_bid_id).first
      selected_bid.update status: 'selected'
    else
      bids.each do |bid|
        bid.update status: 'pending'
      end
    end
  end
end
