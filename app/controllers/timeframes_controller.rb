class TimeframesController < ApplicationController
  before_action :set_current, only: [:index]

  def index
    timeframes = Timeframe.where(
      organization_id: current_user.organization_id,
      user_id: current_user.id,
      in_at: Timeframe.current_range,
      deleted_at: nil,
    ).order(in_at: :asc)
    @timeframe_set_map = {Timeframe.current_range.first.to_date => ::Timeframe::Set.new(timeframes)}
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
