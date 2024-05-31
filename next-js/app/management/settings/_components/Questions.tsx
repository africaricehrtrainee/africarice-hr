import Button from '@/components/ui/Button';
import { usePostSettings } from '@/features/settings/mutations';
import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react'

function QuestionItem({ question, setSettings }: { question: Setting, setSettings: React.Dispatch<React.SetStateAction<Setting[]>> }) {
    return <div className='mb-2 flex flex-col gap-1 w-full'>
        <p className='text-[12px] font-medium text-zinc-800'>{question.name}</p>
        <textarea
            value={question.value}
            onChange={(e) => {
                setSettings((prev) => {
                    return prev.map((setting) => {
                        if (setting.name === question.name) {
                            return { ...setting, value: e.target.value };
                        }
                        return setting;
                    });
                });
            }}
            className='w-1/2 h-20 border border-zinc-200 rounded-md p-2 mt-1'
        >

        </textarea>
    </div>
}

function Questions({ questions }: { questions: Setting[] }) {
    const [settings, setSettings] = useState<Setting[]>(questions);
    const mutation = usePostSettings();
    return (
        <div className="flex flex-col mt-4 justify-start items-start w-full">
            {settings.map((setting, i) => {
                return <QuestionItem key={i} question={setting} setSettings={setSettings} />;
            })}
            <Button type="button" variant="primary" className="mt-2"
                onClick={() => mutation.mutate(settings)}
                disabled={
                    JSON.stringify(settings) === JSON.stringify(questions)
                }>
                Save changes
                <Icon icon="fluent:save-20-filled" className="ml-1" fontSize={16} />
            </Button>
        </div>
    )
}

export default Questions