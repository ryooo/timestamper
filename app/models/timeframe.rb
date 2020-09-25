class Timeframe < ActiveRecord::Base
  serialize :history
  class Set
    attr_reader :timeframes
    def self.date_map(timeframes, dates)
      dates = dates.to_a if dates.is_a?(::Range)
      map = Hash[*[dates, [nil] * dates.size].transpose.flatten]
      timeframes.each do |timeframe|
        map[timeframe.date] ||= ::Timeframe::Set.new
        map[timeframe.date].timeframes << timeframe
      end
      map
    end

    def initialize(timeframes = [])
      @timeframes = timeframes
    end

    def total_sec
      return 0 if self.timeframes.blank?
      first = self.timeframes.map(&:in_at).min
      last = self.timeframes.map(&:out_at).compact.max
      [((last || Time.current) - first).to_i, 0].max
    end

    def total_in_sec
      self.timeframes.sum(&:sec)
    end

    def total_out_sec
      total_sec - total_in_sec
    end
  end

  def sec
    [((self.out_at || Time.current).to_i - self.in_at.to_i), 0].max
  end

  def date
    self.in_at.to_date
  end

  def active?
    self.out_at.nil?
  end

  def to_modal_hash(user)
    {
      id: self.id,
      organization_name: user.organization.name,
      user_name: user.name,
      in_at: self.in_at,
      out_at: self.out_at,
      memo: self.memo,
    }
  end

  def self.current_range(today = nil)
    today ||= Date.today
    if Time.current.hour < 4
      (today.beginning_of_day + 4.hours - 1.day)..(today.end_of_day + 4.hours - 1.day)
    else
      (today.beginning_of_day + 4.hours)..(today.end_of_day + 4.hours)
    end
  end

  def self.params_to_time(date, time, default_date = nil)
    return nil if time.empty?
    if date.empty?
      return nil if default_date.empty?
      date = default_date
    end
    Time.parse("#{date} #{time}") rescue nil
  end
end
