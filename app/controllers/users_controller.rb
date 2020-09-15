class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current
  def index
    @calender = Calender.generate(
      date: @current.target_date,
      term: @current.term,
    )
  end

  def edit
    render_jsonps([
      Jsonp::ShowModal.new(render_to_string(layout: nil)),
    ])
  end
end
