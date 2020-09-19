class Stamp < ActiveRecord::Base
  serialize :timeframes
  class Timeframe
    attr_reader :date
    def initialize(h, date)
      @in_at = h[:i]
      @out_at = h[:o]
      @date = date
    end

    def sec
      ((@out_at || Time.current.to_i) - @in_at)
    end

    def in_at
      Time.at(@in_at)
    end

    def out_at
      Time.at(@out_at) rescue nil
    end
  end

  def timeframe_rows
    @timeframe_rows ||= (self.timeframes || []).map {|e| Timeframe.new(e, self.date) }
  end

  def active?
    last = self.timeframes&.last || {}
    last[:i] != nil && last[:o] == nil
  end

  def total_sec
    first = self.timeframe_rows.map(&:in_at).min
    last = self.timeframe_rows.map(&:out_at).min rescue Time.current
    last - first
  end

  def total_in_sec
    self.timeframe_rows.sum(&:sec)
  end

  def total_out_sec
    total_sec - total_in_sec
  end

  def in(time)
    self.timeframes ||= []
    raise "timeframesはすでにactiveです #{self.id} #{self.timeframes}" if self.active?
    raise "inが早すぎます #{self.id} #{self.timeframes}" if self.timeframes.present? && time.to_i < self.timeframes.last[:o].to_i
    self.timeframes << {i: time.to_i}
  end

  def out(time)
    raise "timeframesがactiveではありません #{self.id} #{self.timeframes}" unless self.active?
    raise "outが早すぎます #{self.id} #{self.timeframes}" if time.to_i < self.timeframes.last[:i]
    self.timeframes.last[:o] = time.to_i
  end

  def as_json(options = {})
    h = super({
      except: [:organization_id, :updated_at, :created_at],
    }.merge(options))
    h[:type] = self.class.name.split("::").last.downcase
    h
  end
end
