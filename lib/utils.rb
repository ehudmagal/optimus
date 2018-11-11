module Utils
  def convert_real_utc_to_local_utc(real_utc, timezone)
    offset = real_utc.in_time_zone(timezone).utc_offset
    real_utc + offset
  end
end