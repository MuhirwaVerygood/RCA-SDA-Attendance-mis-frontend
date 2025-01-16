import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Message } from './Navbar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type AboutPageProps = {
    setMessage: React.Dispatch<React.SetStateAction<Message>>;
    message: Message;
};
    
const AboutPage: React.FC<AboutPageProps> = ({ setMessage, message }) => {

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        e.preventDefault();
        const { name, value } = e.target;

        setMessage((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    return (
        <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <Input
                name="email"
                value={message.email}
                onChange={handleChange}
                className='focus:ring-2 focus:ring-blue-300'
            />
            <div className="flex flex-col space-y-3">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    className='focus:outline-none focus:border-[1px] focus:border-gray-200'
                    name="content"
                    value={message.content}
                    onChange={handleChange}
                    placeholder='Type your message here'
                />
            </div>
            <div className="flex justify-end">
                <Button className="w-[40%]">Send</Button>
            </div>
        </div>
    );
};

export default AboutPage;
