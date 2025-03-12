import { Modal, Pressable, Text, View } from 'react-native';

export type ModalButtonProps = {
    text: string;
    textColor: string;
    color: string;
    onPress: () => void;
};

type CustomModalProps = {
    isActive?: boolean;
    title?: string;
    message?: string;
    buttons?: ModalButtonProps[];
};
export const CustomModal = ({
    isActive = false,
    title = 'Title',
    message = 'Modal Message',
    buttons = [
        {
            text: 'Button',
            textColor: 'text-white',
            color: 'color-slate-400',
            onPress: () => console.log('Pressed Modal Button'),
        },
    ],
}: CustomModalProps) => {
    if (!isActive) return null;

    return (
        <Modal
            animationType="slide"
            visible={isActive}
            onRequestClose={() => {
                console.log('Modal has been closed.');
            }}>
            <View className="flex-1">
                <View className="size-full items-center justify-center bg-slate-800 p-4 text-white">
                    <Text className="text-lg text-white">{title}</Text>
                    <Text className="mt-4 text-white">{message}</Text>
                    <View className="">
                        {buttons.map((button, index) => (
                            <ModalButton
                                key={'modalbtn_' + index}
                                text={button.text}
                                textColor={button.textColor}
                                color={button.color}
                                onPress={button.onPress}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const ModalButton = ({ text, textColor, color, onPress }: ModalButtonProps) => {
    return (
        <Pressable className={`flex-1 rounded-lg p-2 ${color}`} onPress={onPress}>
            <Text className={` ${textColor}`}>{text}</Text>
        </Pressable>
    );
};
