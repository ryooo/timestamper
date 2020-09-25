class TimeframesController < ApplicationController
  before_action :set_current, only: [:index]

  def index
    timeframes = Timeframe.where(
      organization_id: current_user.organization_id,
      user_id: current_user.id,
      in_at: (@current.start_date.beginning_of_day .. @current.end_date.end_of_day),
      deleted_at: nil,
    ).order(in_at: :asc)
    @timeframe_set_map = ::Timeframe::Set.date_map(
      timeframes,
      @current.start_date .. @current.end_date
    )
  end

  def update
    if timeframe = Timeframe.find(params[:timeframe][:id])
      message = nil
      if params[:timeframe][:delete]
        timeframe.deleted_at = Time.current
        timeframe.save!
        message = "削除しました"

      elsif params[:timeframe][:save]
        timeframe.memo = params[:timeframe][:memo].strip_all_space_and_empty_to_nil
        timeframe.in_at = Timeframe.params_to_time(
          params[:timeframe][:in_date],
          params[:timeframe][:in_time],
        )
        timeframe.out_at = Timeframe.params_to_time(
          params[:timeframe][:out_date],
          params[:timeframe][:out_time],
          params[:timeframe][:in_date],
        )
        timeframe.save!
        message = "保存しました"

      end
      flash[:flash_message] = {
        type: :notice,
        icon: :"fa-check-circle",
        message: message,
      } unless message.nil?
    end
    redirect_to controller: :dashboard, action: :index
  end
end
