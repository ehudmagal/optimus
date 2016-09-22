class Order < ActiveRecord::Base
  belongs_to :user
  has_many :bids
  after_save :set_bids_status
  after_create :set_default_status
  STATUSES = {booked: 'booked', bidded: 'bidded', approved: 'approved',
              before_pickup: 'before_pickup', picked_up: 'picked_up', delivered: 'delivered'}

  def json_attributes
    json = as_json
    json['user'] = user
    json['bids'] = bids.map { |bid| bid.json_attributes }
    json
  end

  def set_bids_status
    unless selected_bid_id.nil?
      over_bids = bids.where.not(id: selected_bid_id)
      over_bids.each do |bid|
        bid.update status:  Bid::STATUSES[:over]
      end
      selected_bid = bids.where(id: selected_bid_id).first
      selected_bid.update status: Bid::STATUSES[:selected]
      self.update status: STATUSES[:approved]
    else
      bids.each do |bid|
        bid.update status:  Bid::STATUSES[:pending]
      end
    end
  end

  private
  def set_default_status
    self.update status: STATUSES[:booked]
  end

end
