class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current
  def index
    @calender = Calender.generate(
      date: @current.target_date,
      term: @current.term,
    )
    timeframes = Timeframe.where(
      organization_id: current_user.organization_id,
      user_id: current_user.id,
      in_at: Timeframe.current_range,
      deleted_at: nil,
    ).order(in_at: :asc)
    @timeframe_set_map = {Timeframe.current_range.first.to_date => ::Timeframe::Set.new(timeframes)}
    @timeframe = timeframes.detect {|e| e.active? }
  end

  def stamp
    now = Time.current
    jsonps = []
    @timeframe = Timeframe.find_or_initialize_by(
      organization_id: current_user.organization_id,
      user_id: current_user.id,
      out_at: nil,
    )
    act = if @timeframe.new_record?
      @timeframe.in_at = now
      :in
    else
      @timeframe.out_at = now
      :out
    end
    @timeframe.save!
    flash[:flash_message] = {
      type: :notice,
      icon: :"fa-check-circle",
      message: "#{now.to_s(:jp_md_hms)} - #{act}しました",
    }
    redirect_to action: :index
  end
end
