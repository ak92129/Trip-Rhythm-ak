import OpenAI from 'openai';
import type { AIProvider } from './types';
import type { DayPlan, TripFormData } from '../../types';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

  async generateItinerary(tripData: TripFormData): Promise<DayPlan[]> {
    const prompt = this.buildGeneratePrompt(tripData);

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning expert. Generate detailed, realistic day-by-day itineraries that respect user constraints. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    return parsed.days as DayPlan[];
  }

  async adjustDayForFatigue(
    currentDay: DayPlan,
    dayIndex: number,
    allDays: DayPlan[],
    tripContext: TripFormData
  ): Promise<{ originalDay: DayPlan; adjustedDay: DayPlan }> {
    const prompt = this.buildAdjustPrompt(currentDay, dayIndex, allDays, tripContext);

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning expert. Adjust itineraries to reduce fatigue while maintaining trip quality. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    return {
      originalDay: parsed.originalDay,
      adjustedDay: parsed.adjustedDay,
    };
  }

  private buildGeneratePrompt(tripData: TripFormData): string {
    const startDate = new Date(tripData.start_date);

    return `Generate a ${tripData.days}-day travel itinerary for ${tripData.destination}.

Trip Details:
- Destination: ${tripData.destination}
- Start Date: ${tripData.start_date}
- Number of Days: ${tripData.days}
- Travel Style: ${tripData.travel_style} (chill = relaxed pace with downtime; balanced = moderate sightseeing with breaks; intense = packed schedule)
- Walking Tolerance: ${tripData.walking_tolerance} (low = minimal walking, use transport; medium = moderate walking with breaks; high = comfortable with long walks)
- Wake Time: ${tripData.wake_time}
- Sleep Time: ${tripData.sleep_time}
${tripData.must_see_places ? `- Must-See Places: ${tripData.must_see_places}` : ''}

Requirements:
1. Create ${tripData.days} days of activities
2. Respect the wake time (${tripData.wake_time}) and sleep time (${tripData.sleep_time})
3. Match the travel style (${tripData.travel_style}) - adjust activity density accordingly
4. Match the walking tolerance (${tripData.walking_tolerance}) - adjust physical demands
5. Include must-see places if specified: ${tripData.must_see_places || 'none specified'}
6. Each activity should have a time, name, description, and effort level (low/medium/high)
7. Effort levels should reflect physical and mental demands
8. For ${tripData.travel_style} style and ${tripData.walking_tolerance} walking tolerance, balance activity intensity appropriately

Return JSON in this exact format:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "summary": "Brief overview of the day",
      "activities": [
        {
          "time": "HH:MM",
          "name": "Activity name",
          "description": "What you'll do and why it's worthwhile",
          "effortLevel": "low|medium|high"
        }
      ]
    }
  ]
}

Generate realistic, engaging activities. Make dates sequential starting from ${tripData.start_date}.`;
  }

  private buildAdjustPrompt(
    currentDay: DayPlan,
    dayIndex: number,
    allDays: DayPlan[],
    tripContext: TripFormData
  ): string {
    return `The user finds Day ${dayIndex} too tiring. Adjust this day to reduce fatigue while keeping it enjoyable.

Original Day ${dayIndex} (${currentDay.date}):
${JSON.stringify(currentDay, null, 2)}

Trip Context:
- Destination: ${tripContext.destination}
- Travel Style: ${tripContext.travel_style}
- Walking Tolerance: ${tripContext.walking_tolerance}
- Wake Time: ${tripContext.wake_time}
- Sleep Time: ${tripContext.sleep_time}

Instructions:
1. Reduce the number of activities or their physical demands
2. Add more rest time or leisure activities
3. Lower effort levels where possible (high → medium, medium → low)
4. Consider replacing strenuous activities with relaxing alternatives
5. Keep the day enjoyable and worthwhile

Return JSON in this exact format:
{
  "originalDay": ${JSON.stringify(currentDay)},
  "adjustedDay": {
    "date": "${currentDay.date}",
    "summary": "Updated summary reflecting the more relaxed pace",
    "activities": [
      {
        "time": "HH:MM",
        "name": "Activity name",
        "description": "Description",
        "effortLevel": "low|medium|high"
      }
    ]
  }
}`;
  }
}
