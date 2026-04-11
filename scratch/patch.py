import sys

file_path = r'c:\Aura AI\src\components\analytics.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_js = """        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 backdrop-blur-3xl bg-card/40 border-border/40 shadow-xl rounded-[1.5rem] relative overflow-hidden group flex items-center justify-between h-full hover:border-[var(--primary)]/30 transition-all duration-300">
                <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:scale-[2] transition-transform duration-700 pointer-events-none`}></div>
                <div className="relative z-10">
                  <div className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2">{stat.name}</div>
                  <div className="text-[32px] font-bold leading-none tracking-tight">{stat.value}</div>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)] transform group-hover:rotate-6 transition-transform duration-300 relative z-10 shrink-0`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Productivity Trends (Col Span 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 h-full"
          >
            <Card className="p-8 backdrop-blur-3xl bg-card/40 border-border/40 shadow-xl rounded-[1.5rem] flex flex-col h-[400px] relative overflow-hidden group hover:border-[var(--primary)]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:translate-x-10 group-hover:-translate-y-10 pointer-events-none"></div>
              <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
                <div>
                  <h3 className="text-[20px] font-semibold tracking-tight flex items-center gap-2">Productivity Trends</h3>
                  <p className="text-[13.5px] font-medium text-muted-foreground mt-1.5">Tasks completed per day over the last week</p>
                </div>
                <div className="p-3 rounded-[14px] bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 shadow-lg shadow-blue-500/10 shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
              </div>

              <div className="relative z-10 flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                       axisLine={false}
                       tickLine={false}
                       tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} 
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="tasks"
                      stroke="#3b82f6"
                      fill="url(#productivityAreaGradient)"
                      strokeWidth={3}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.8))' } }}
                    />
                    <defs>
                      <linearGradient id="productivityAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Performance Score / Radial (Col Span 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-full"
          >
            <Card className="p-8 backdrop-blur-3xl bg-card/40 border-border/40 shadow-xl rounded-[1.5rem] flex flex-col items-center justify-center h-[400px] relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:translate-x-10 group-hover:-translate-y-10 pointer-events-none"></div>
               <h3 className="text-[20px] font-semibold tracking-tight absolute top-6 left-6">Efficiency</h3>
               <p className="text-[13.5px] font-medium text-muted-foreground absolute top-14 left-6">Task completion rate</p>
               
               <div className="relative mt-12 group-hover:scale-105 transition-transform duration-500 cursor-pointer">
                <div 
                  className="absolute inset-0"
                >
                  <ResponsiveContainer width="100%" height="100%" className="-rotate-90 origin-center">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[{value: 100}]} barSize={12}>
                      <RadialBar
                        background={false}
                        dataKey="value"
                        cornerRadius={12}
                        className="fill-[var(--primary)]/5"
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-[180px] h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={circularData} startAngle={90} endAngle={-270} barSize={12}>
                        <RadialBar
                        className="drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                        dataKey="value"
                        cornerRadius={12}
                        fill="url(#efficiencyGradient)"
                        />
                        <defs>
                        <linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        </defs>
                    </RadialBarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-[42px] font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm leading-none">{analyticsData.completionRate}%</div>
                    <div className="text-[11px] font-semibold text-muted-foreground tracking-[0.2em] uppercase mt-2">Rate</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Activity Patterns (Col Span 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 h-full"
          >
             <Card className="p-8 backdrop-blur-3xl bg-card/40 border-border/40 shadow-xl rounded-[1.5rem] flex flex-col h-[380px] relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 group-hover:scale-[1.5] pointer-events-none"></div>
                <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
                    <div>
                        <h3 className="text-[20px] font-semibold tracking-tight">Activity Heatmap</h3>
                        <p className="text-[13.5px] font-medium text-muted-foreground mt-1.5">Intensities of tasks created throughout the day</p>
                    </div>
                    <div className="p-3 rounded-[14px] bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10 shrink-0">
                        <Activity className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>

                <div className="relative z-10 flex-1 min-h-0 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.formattedActivityPatterns} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                        <XAxis 
                            dataKey="hour" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} 
                            cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }}
                        />
                        <Bar 
                            dataKey="tasks" 
                            fill="url(#heatmapGradient)"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                            className="drop-shadow-[0_4px_4px_rgba(16,185,129,0.2)]"
                        />
                        <defs>
                            <linearGradient id="heatmapGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </Card>
          </motion.div>

          {/* Task Status Donut (Col Span 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="h-full"
          >
             <Card className="p-8 backdrop-blur-3xl bg-card/40 border-border/40 shadow-xl rounded-[1.5rem] flex flex-col h-[380px] relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:translate-x-10 group-hover:-translate-y-10 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-2 relative z-10 shrink-0">
                    <div>
                        <h3 className="text-[20px] font-semibold tracking-tight">Distribution</h3>
                        <p className="text-[13.5px] font-medium text-muted-foreground mt-1.5">Current state of active tasks</p>
                    </div>
                </div>

                <div className="relative z-10 flex-1 min-h-0 w-full flex flex-col items-center justify-center">
                    <div className="w-full h-[180px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} 
                            />
                            <Pie
                                data={analyticsData.taskDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {analyticsData.taskDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{filter: `drop-shadow(0px 4px 6px ${COLORS[index % COLORS.length]}40)` }}/>
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="w-full grid grid-cols-2 gap-x-3 gap-y-3 mt-auto pt-6">
                        {analyticsData.taskDistribution.map((item, index) => (
                        <div key={index} className="flex flex-col items-center bg-background/50 rounded-xl p-2.5 backdrop-blur-md border border-border/40">
                            <div className="flex items-center mb-1">
                                <div 
                                className="w-2.5 h-2.5 rounded-[4px] mr-1.5 shadow-inner"
                                style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}
                                />
                                <span className="text-[11px] font-medium text-muted-foreground/90 truncate uppercase tracking-wider">{item.name}</span>
                            </div>
                            <span className="text-foreground font-semibold text-[16px]">{item.value}</span>
                        </div>
                        ))}
                    </div>
                </div>
             </Card>
          </motion.div>

        </div>

        {/* AI Insights (Full Width Wrap) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="p-8 backdrop-blur-3xl bg-card/40 border-border/40 shadow-xl rounded-[2rem] relative overflow-hidden flex flex-col hover:border-indigo-500/30 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
                <div className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-5 shadow-[0_8px_30px_-8px_rgba(99,102,241,0.5)]">
                        <Sparkles className="w-[24px] h-[24px] text-white" />
                    </div>
                    <div>
                        <h3 className="text-[24px] font-semibold tracking-tight">AI-Powered Insights</h3>
                        <p className="text-[14.5px] font-medium text-muted-foreground mt-1">Deep analysis and recommended actions from Aura AI</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {analyticsData.aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-6 rounded-[1.5rem] bg-card/50 hover:bg-card/80 backdrop-blur-2xl border border-border/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col h-full"
                >
                  <div className="flex flex-col mb-4 gap-3">
                    <Badge 
                      variant="outline"
                      className={`self-start text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border-0 bg-background/80 backdrop-blur-sm ${
                        insight.impact === 'high' 
                          ? 'text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.15)]' 
                          : 'text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                      }`}
                    >
                      {insight.impact} impact
                    </Badge>
                    <h4 className="font-semibold tracking-tight text-[16px] leading-tight">{insight.title}</h4>
                  </div>
                  <p className="text-[14px] font-medium text-muted-foreground mb-6 leading-relaxed flex-1">
                    {insight.description}
                  </p>
                  <Button 
                    variant="default"
                    className="w-full text-[13px] font-semibold rounded-xl h-10 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-none border-0"
                  >
                    <Zap className="w-4 h-4 mr-1.5" />
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
"""

lines = lines[:219] + [new_js + '\n'] + lines[554:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
